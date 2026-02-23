import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const stats = await Task.aggregate([
      {
        $match: { user: userId }
      },
      {
        $facet: {
          total: [
            { $count: "count" }
          ],
          statusStats: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ],
          priorityStats: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 }
              }
            }
          ],
          overdue: [
            {
              $match: {
                status: "Pending",
                deadline: { $lt: now }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = stats[0];
    const total = result.total[0]?.count || 0;
    const overdue = result.overdue[0]?.count || 0;

    let completed = 0;
    let pending = 0;
    result.statusStats.forEach(item => {
      if (item._id === "Completed") completed = item.count;
      if (item._id === "Pending") pending = item.count;
    });

    const priorityDistribution = {
      High: 0,
      Medium: 0,
      Low: 0
    };
    result.priorityStats.forEach(item => {
      priorityDistribution[item._id] = item.count;
    });

    res.json({
      total,
      completed,
      pending,
      overdue,
      completionRate: total ? ((completed / total) * 100).toFixed(2) : 0,
      priorityDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

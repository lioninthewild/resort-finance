import pool from "../config/db.js";

// ------------------------------------
// Get all transactions
// ------------------------------------
export async function getTransactions(req, res) {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name AS category 
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Add new transaction
// ------------------------------------
export async function addTransaction(req, res) {
  try {
    const { date, amount, type, category_id, payment_method, description } =
      req.body;

    // Validate required fields
    if (!date || !amount || !type || !category_id) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Validate amount is positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: "Type must be income or expense" });
    }

    // Validate category exists
    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id]
    );
    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid category selected" });
    }

    // Validate date is not in the future
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      return res.status(400).json({ error: "Date cannot be in the future" });
    }

    const receiptImage = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO transactions (date, amount, type, category_id, payment_method, description, receipt_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        date,
        parsedAmount,
        type,
        category_id,
        payment_method?.trim() || null,
        description?.trim() || null,
        receiptImage,
      ]
    );

    // Create notification
    const categoryResult = await pool.query(
      "SELECT name FROM categories WHERE id = $1",
      [category_id]
    );
    const categoryName = categoryResult.rows[0]?.name || 'Unknown';
    
    await pool.query(
      `INSERT INTO notifications (type, message, data) VALUES ($1, $2, $3)`,
      [
        'transaction_added',
        `New ${type}: NPR ${parsedAmount} - ${categoryName}`,
        JSON.stringify(result.rows[0])
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Delete transaction
// ------------------------------------
export async function deleteTransaction(req, res) {
  try {
    const id = req.params.id;

    // Get transaction details before deletion for notification
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    await pool.query(`DELETE FROM transactions WHERE id = $1`, [id]);

    // Create notification
    if (transaction.rows.length > 0) {
      const tx = transaction.rows[0];
      await pool.query(
        `INSERT INTO notifications (type, message, data) VALUES ($1, $2, $3)`,
        [
          'transaction_deleted',
          `Transaction deleted: NPR ${tx.amount} (${tx.type})`,
          JSON.stringify(tx)
        ]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Get categories
// ------------------------------------
export async function getCategories(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM categories ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Get category by ID
// ------------------------------------
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Create category (admin only)
// ------------------------------------
export async function createCategory(req, res) {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, type) VALUES ($1, $2) RETURNING *`,
      [name, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: "Category already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Summary for dashboard
// ------------------------------------
export async function getSummary(req, res) {
  try {
    const totals = await pool.query(`
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
    `);

    const categories = await pool.query(`
      SELECT c.name, SUM(t.amount) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      GROUP BY c.name
      ORDER BY c.name
    `);

    res.json({
      totalIncome: totals.rows[0].total_income || 0,
      totalExpense: totals.rows[0].total_expense || 0,
      net:
        (totals.rows[0].total_income || 0) -
        (totals.rows[0].total_expense || 0),
      categoryBreakdown: categories.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Monthly summary (income vs expense by month)
// ------------------------------------
export async function getMonthlySummary(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Summary by date range
// ------------------------------------
export async function getSummaryByDateRange(req, res) {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const totals = await pool.query(`
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE date BETWEEN $1 AND $2
    `, [start_date, end_date]);

    res.json({
      startDate: start_date,
      endDate: end_date,
      totalIncome: totals.rows[0].total_income || 0,
      totalExpense: totals.rows[0].total_expense || 0,
      net: (totals.rows[0].total_income || 0) - (totals.rows[0].total_expense || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Category breakdown (separate income and expense)
// ------------------------------------
export async function getCategoryBreakdown(req, res) {
  try {
    const incomeCategories = await pool.query(`
      SELECT c.name, SUM(t.amount) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'income'
      GROUP BY c.name
      ORDER BY total DESC
    `);

    const expenseCategories = await pool.query(`
      SELECT c.name, SUM(t.amount) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'expense'
      GROUP BY c.name
      ORDER BY total DESC
    `);

    res.json({
      income: incomeCategories.rows,
      expense: expenseCategories.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Get notifications (admin only)
// ------------------------------------
export async function getNotifications(req, res) {
  try {
    const result = await pool.query(`
      SELECT * FROM notifications 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------
// Mark notification as read
// ------------------------------------
export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE notifications SET read = TRUE WHERE id = $1`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

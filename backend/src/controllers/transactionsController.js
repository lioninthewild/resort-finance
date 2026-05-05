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
    const receiptImage = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO transactions (date, amount, type, category_id, payment_method, description, receipt_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        date,
        amount,
        type,
        category_id,
        payment_method,
        description,
        receiptImage,
      ]
    );

    res.json(result.rows[0]);
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

    await pool.query(`DELETE FROM transactions WHERE id = $1`, [id]);

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

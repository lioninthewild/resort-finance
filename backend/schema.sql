-- Resort Tracker Database Schema
-- Run this in PostgreSQL to create the database

-- Create categories table (seed data)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    payment_method VARCHAR(50),
    description TEXT,
    receipt_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, type) VALUES
    ('Room', 'income'),
    ('Food & Beverage', 'income'),
    ('Events', 'income'),
    ('Other Income', 'income'),
    ('Salaries', 'expense'),
    ('Utilities', 'expense'),
    ('Maintenance', 'expense'),
    ('Supplies', 'expense'),
    ('Marketing', 'expense'),
    ('Other Expense', 'expense')
ON CONFLICT (name) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
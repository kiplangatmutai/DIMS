# DIMS Database Schema

This folder contains the database schema for the Node.js backend.

## Database

The schema targets PostgreSQL 14+.

Files:

- `schema.sql` creates tables, constraints, relationships, and indexes.
- `seed.sql` inserts development data that matches the current mock API data.
- `tables.mjs` exports table names and shared status values for Node.js code.

## Setup

Create a database, then run:

```bash
psql "$DATABASE_URL" -f server/database/schema.sql
psql "$DATABASE_URL" -f server/database/seed.sql
```

Use environment variables in Node.js:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/dims
```

## Main Entities

- Identity: `users`, `roles`, `role_routes`, `refresh_tokens`
- Geography: `counties`, `sub_counties`, `facilities`
- Inventory: `device_types`, `devices`, `inventory_movements`
- Requests: `requisitions`, `requisition_items`, `approval_events`
- Vendor flow: `vendor_orders`, `vendor_order_items`, `dispatches`, `dispatch_devices`
- Operations: `proof_of_deliveries`, `asset_transfers`, `maintenance_tickets`, `stolen_reports`, `handovers`
- System: `notifications`, `audit_logs`

## Backend Notes

Store only password hashes in `users.password_hash`. The placeholder seed values
must be replaced with real hashes before production use.

The current `server/index.mjs` still uses in-memory data. The next backend step
is to add a PostgreSQL client such as `pg`, then replace array reads/writes with
repository functions that query these tables.

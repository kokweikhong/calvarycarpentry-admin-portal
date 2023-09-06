CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) NOT NULL,
    is_exist BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_products (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(255) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    standard_unit VARCHAR(255) NOT NULL,
    product_thumbnail VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    remarks VARCHAR(255),
    is_exist BOOLEAN NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS inventory_incoming (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES inventory_products(id) NOT NULL,
    status VARCHAR(255) NOT NULL,
    quantity NUMERIC NOT NULL,
    length NUMERIC,
    width NUMERIC,
    thickness NUMERIC,
    unit VARCHAR(255),
    converted_quantity NUMERIC NOT NULL,
    ref_no VARCHAR(255) NOT NULL,
    ref_doc VARCHAR(255) NOT NULL,
    cost NUMERIC,
    store_location VARCHAR(255),
    store_country VARCHAR(255),
    remarks VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS inventory_outgoing (
    id SERIAL PRIMARY KEY,
    incoming_id INTEGER REFERENCES inventory_incoming(id),
    status VARCHAR(255) NOT NULL,
    quantity NUMERIC NOT NULL,
    converted_quantity NUMERIC NOT NULL,
    cost NUMERIC,
    ref_no VARCHAR(255) NOT NULL,
    ref_doc VARCHAR(255) NOT NULL,
    remarks VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW inventory_products_summary AS
SELECT p.id,
    p.product_code,
    p.product_name,
    p.brand,
    p.standard_unit,
    p.product_thumbnail,
    p.supplier,
    p.remarks,
    p.is_exist,
    p.created_by,
    p.created_at,
    p.updated_by,
    p.updated_at,
    COALESCE(sum(i.converted_quantity), (0)::numeric) AS sum_incoming_converted_quantity,
    COALESCE(sum(i.cost), (0)::numeric) AS sum_incoming_cost,
    COALESCE(sum(o.converted_quantity), (0)::numeric) AS sum_outgoing_converted_quantity,
    COALESCE(sum(o.cost), (0)::numeric) AS sum_outgoing_cost,
    (COALESCE(sum(i.converted_quantity), (0)::numeric) - COALESCE(sum(o.converted_quantity), (0)::numeric)) AS available_quantity
   FROM 
     inventory_products p
   JOIN 
     inventory_incoming i ON i.product_id = p.id
   LEFT JOIN (
    SELECT
        i.id AS incoming_id,
        SUM(io.converted_quantity) AS converted_quantity,
        SUM(io.cost) AS cost
    FROM
        inventory_incoming i
    LEFT JOIN
        inventory_outgoing io ON i.id = io.incoming_id
    GROUP BY
        i.id
) o ON i.id = o.incoming_id
  GROUP BY p.id;

-- CREATE OR REPLACE VIEW inventory_products_summary AS
-- SELECT 
--     p.*,
--     COALESCE(SUM(i.converted_quantity), 0) AS sum_incoming_converted_quantity,
--     COALESCE(SUM(i.cost), 0) AS sum_incoming_cost,
--     COALESCE(SUM(o.converted_quantity), 0) AS sum_outgoing_converted_quantity,
--     COALESCE(SUM(o.cost), 0) AS sum_outgoing_cost,
--     COALESCE(SUM(i.converted_quantity), 0) - COALESCE(SUM(o.converted_quantity), 0) AS available_quantity
-- FROM 
--     inventory_products p
-- LEFT JOIN 
--     inventory_incoming i ON p.id = i.product_id
-- LEFT JOIN 
--     inventory_outgoing o ON i.id = o.incoming_id
-- GROUP BY 
--     p.id;

CREATE OR REPLACE VIEW inventory_incoming_summary AS
SELECT 
    i.*,
    p.product_code,
    p.product_name,
    p.supplier,
    p.standard_unit,
    COALESCE(SUM(o.converted_quantity), 0) AS sum_outgoing_converted_quantity,
    COALESCE(SUM(o.quantity), 0) AS sum_outgoing_quantity,
    COALESCE(SUM(o.cost), 0) AS sum_outgoing_cost,
    i.converted_quantity - COALESCE(SUM(o.converted_quantity), 0) AS available_converted_quantity,
    i.quantity - COALESCE(SUM(o.quantity), 0) AS available_quantity
FROM 
    inventory_incoming i
JOIN 
    inventory_products p ON i.product_id = p.id
LEFT JOIN 
    inventory_outgoing o ON i.id = o.incoming_id
GROUP BY 
    i.id, p.product_code, p.product_name, p.supplier, p.standard_unit;


CREATE VIEW inventory_outgoing_summary AS
SELECT 
    o.*,
    p.product_code,
    p.product_name,
    p.supplier,
    p.standard_unit
FROM 
    inventory_outgoing o
JOIN 
    inventory_incoming i ON o.incoming_id = i.id
JOIN 
    inventory_products p ON i.product_id = p.id;


CREATE VIEW inventory_incoming_summary_filtered AS
SELECT *
FROM inventory_incoming_summary
WHERE converted_quantity > 0;


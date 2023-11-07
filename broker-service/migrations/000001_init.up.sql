INSERT INTO "inventory_products" ("id", "product_code", "product_name", "brand", "standard_unit", "product_thumbnail", "supplier", "remarks", "is_exist", "created_by", "created_at", "updated_by", "updated_at") VALUES
(4,	'CC001',	'Composite Ivory/Rum',	'Calvary Composite',	'sqm',	'uploads/inventory/products/4eb9480e-10d9-4918-a63b-5c23c2972b77.jpeg',	'U-Timber (China)',	'',	't',	'Khong Kok Wei',	'2023-08-25 03:08:03.25375',	'Khong Kok Wei',	'2023-08-25 03:08:03.25375'),
(6,	'KL.3513',	'KLite Natural Walnut',	'Kandinsky Lite',	'sqm',	'uploads/inventory/products/316c1373-c42b-4013-ab09-1a20b615fe64.jpeg',	'LJX (Stephen China)',	'',	't',	'Khong Kok Wei',	'2023-08-25 03:50:54.954698',	'Khong Kok Wei',	'2023-08-25 03:50:54.954698'),
(7,	'KL.8316',	'KLite Milled Oak',	'Kandinsky Lite',	'sqm',	'uploads/inventory/products/d38c4521-3e3d-42db-82d0-262d182d80c0.jpeg',	'LJX (Stephen China)',	'',	't',	'Khong Kok Wei',	'2023-08-25 03:52:30.960384',	'Khong Kok Wei',	'2023-08-25 03:52:30.960384'),
(8,	'KL.F356',	'KLite Glacier Ash',	'Kandinsky Lite',	'sqm',	'uploads/inventory/products/669673fc-6636-434b-8b5d-1c6b4982262b.jpeg',	'LJX (Stephen China)',	'',	't',	'Khong Kok Wei',	'2023-08-25 03:53:12.147569',	'Khong Kok Wei',	'2023-08-25 03:53:12.147569'),
(9,	'R001',	'Rapid Multifixer Adhesive',	'Rapid',	'l',	'uploads/inventory/products/6ded5cde-09dc-42d1-9610-523da2efca8c.PNG',	'Shandong Sinolinking Industry',	'300ml',	't',	'Khong Kok Wei',	'2023-08-25 05:47:25.133516',	'Khong Kok Wei',	'2023-08-25 05:47:25.133516'),
(10,	'R002',	'Rapid Multifixer Adhesive',	'Rapid',	'l',	'uploads/inventory/products/d8b54d6f-a675-441f-b043-a5233f2785e1.jpeg',	'Shandong Sinolinking Industry',	'600ml',	't',	'Khong Kok Wei',	'2023-08-25 05:52:55.966467',	'Khong Kok Wei',	'2023-08-25 05:52:55.966467'),
(5,	'KL.8529',	'KLite Cream Oak',	'Kandinsky Lite',	'sqm',	'uploads/inventory/products/1f8301cb-bbe2-4092-97c1-18c61dfe418a.jpeg',	'LJX (Stephen China)',	'',	't',	'Khong Kok Wei',	'2023-08-25 03:50:03.14398',	'Mylene',	'2023-08-25 03:50:03.14398');

-- next id is max for inventory_products
SELECT setval('inventory_products_id_seq', (SELECT MAX(id) FROM inventory_products));

INSERT INTO "inventory_incoming" ("id", "product_id", "status", "quantity", "length", "width", "thickness", "unit", "converted_quantity", "ref_no", "ref_doc", "cost", "store_location", "store_country", "remarks", "created_by", "created_at", "updated_by", "updated_at") VALUES
(8,	9,	'incoming',	4800,	225,	45,	0,	'mm',	4800,	'CCP-SLK20230802036',	'uploads/inventory/incoming/289bb70a-c85d-4661-a1b7-d61874fa98bb.pdf',	1.699,	'Rapid Pallet',	'Singapore',	'per tube size',	'Khong Kok Wei',	'2023-08-25 07:15:11.597711',	'Khong Kok Wei',	'2023-08-25 07:15:13.660751'),
(9,	10,	'incoming',	2400,	400,	60,	0,	'mm',	2400,	'CCP-SLK20230802036',	'uploads/inventory/incoming/21427185-fd8d-481b-8205-9eb3b94b3d9c.pdf',	2.579,	'Rapid Pallet',	'Singapore',	'per sausage size',	'Khong Kok Wei',	'2023-08-25 07:28:40.432638',	'Khong Kok Wei',	'2023-08-25 07:28:42.624404'),
(5,	6,	'in-stock',	300,	1210,	168,	15,	'mm',	300,	'LJX2023031301',	'uploads/inventory/incoming/719c61f4-b22a-49a6-b17a-a252fbc307c6.doc',	27.28,	'LJX Pallet ',	'Singapore',	'',	'Khong Kok Wei',	'2023-08-25 05:30:44.122931',	'Mylene',	'2023-09-06 08:08:38.85069'),
(7,	8,	'in-stock',	300,	1210,	163,	15,	'mm',	300,	'LJX2023031301',	'uploads/inventory/incoming/8a5eebd1-d827-4808-aef0-a3200ff94c1c.doc',	24.343,	'LJX Pallet ',	'Singapore',	'',	'Khong Kok Wei',	'2023-08-25 05:32:38.747254',	'Mylene',	'2023-09-06 08:09:59.902209'),
(6,	7,	'in-stock',	200,	1210,	163,	15,	'mm',	200,	'LJX2023031301',	'uploads/inventory/incoming/c514a2f9-c66d-43e7-b4d2-95e49d334da5.doc',	34.061,	'LJX Pallet ',	'Singapore',	'',	'Khong Kok Wei',	'2023-08-25 05:31:47.592997',	'Mylene',	'2023-09-06 08:10:11.174319'),
(3,	4,	'in-stock',	226.8,	2400,	140,	21,	'mm',	226.8,	'TB23CAL1S',	'uploads/inventory/incoming/92cf744b-b712-48da-8964-a1adc758a80d.doc',	40,	'Utimber Pallet 1-12',	'Singapore',	'',	'Khong Kok Wei',	'2023-08-25 03:27:43.501753',	'Mylene',	'2023-09-06 08:12:54.059983'),
(4,	5,	'in-stock',	300,	1210,	168,	15,	'mm',	300,	'LJX2023031301',	'uploads/inventory/incoming/ada9c5c5-e209-442e-9cbd-e6e86022addc.doc',	27.28,	'LJX Pallet ',	'Singapore',	'',	'Khong Kok Wei',	'2023-08-25 05:21:30.249819',	'Mylene',	'2023-09-06 08:33:19.33486');

SELECT setval('inventory_incoming_id_seq', (SELECT MAX(id) FROM inventory_incoming));

INSERT INTO "inventory_outgoing" ("id", "incoming_id", "status", "quantity", "converted_quantity", "cost", "ref_no", "ref_doc", "remarks", "created_by", "created_at", "updated_by", "updated_at") VALUES
(3,	4,	'collected',	9.8615,	9.8615,	269.02172,	'JO-23001',	'uploads/inventory/outgoing/7c173730-d58a-45ac-8706-c5a575d3dd3d.jpeg',	'marina square showroom (calvary)',	'Mylene',	'2023-09-06 08:27:50.406116',	'Mylene',	'2023-09-06 08:27:50.406116'),
(5,	4,	'collected',	230.7591,	230.7591,	6295.108248,	'JO-23001',	'uploads/inventory/outgoing/351db064-a206-4061-8e0c-5f1aac588ec5.jpeg',	'marina square showroom (calvary)',	'Mylene',	'2023-09-21 07:18:13.729706',	'Mylene',	'2023-09-21 07:35:26.040806'),
(6,	4,	'collected',	49.1385,	49.1385,	0,	'JO-23003',	'uploads/inventory/outgoing/de1c5a67-ccdf-48b7-9412-9194cccb5c42.jpeg',	'marina square showroom (calvary)',	'Mylene',	'2023-10-04 06:23:45.108441',	'Mylene',	'2023-10-04 06:25:49.763511'),
(7,	5,	'collected',	40.656,	40.656,	1109.09568,	'JO-23004',	'uploads/inventory/outgoing/1026657e-3367-48fa-8f38-1ae26a80b0f8.jpeg',	'marina square showroom (calvary) - table & panels',	'Mylene',	'2023-10-26 03:06:17.294015',	'Mylene',	'2023-10-26 03:06:17.294015'),
(8,	3,	'collected',	1.344,	1.344,	53.760000000000005,	'sample',	'uploads/inventory/outgoing/82cabb66-54fd-4d55-b195-9c4a5c1b4576.jpeg',	'sample',	'Mylene',	'2023-10-26 06:15:42.092106',	'Mylene',	'2023-10-26 06:15:42.092106'),
(9,	3,	'collected',	10.08,	10.08,	403.2,	'CC-X05268',	'uploads/inventory/outgoing/df4a2511-6a66-44ba-afc4-29bb72b6d98a.pdf',	'supply only',	'Mylene',	'2023-10-26 06:25:37.495622',	'Mylene',	'2023-10-26 06:25:37.495622'),
(10,	3,	'collected',	5.376,	5.376,	215.04000000000002,	'PI-C1256',	'uploads/inventory/outgoing/bc6e19a0-ad37-41e0-b01e-2a13377f4c7f.pdf',	'group buy (vanessa)',	'Mylene',	'2023-10-26 06:33:30.392687',	'Mylene',	'2023-10-26 06:33:30.392687'),
(11,	3,	'collected',	15.792,	15.792,	631.68,	'CC-X05290',	'uploads/inventory/outgoing/9107fa46-0863-41fa-819e-1aef761a3427.pdf',	'additional 1 pc deck we release for defect as per Ruben''s instruction',	'Mylene',	'2023-10-26 06:56:12.006201',	'Mylene',	'2023-10-26 06:56:12.006201');

SELECT setval('inventory_outgoing_id_seq', (SELECT MAX(id) FROM inventory_outgoing));

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
   FROM ((inventory_products p
     JOIN inventory_incoming i ON ((i.product_id = p.id)))
     LEFT JOIN ( SELECT i_1.id AS incoming_id,
            sum(io.converted_quantity) AS converted_quantity,
            sum(io.cost) AS cost
           FROM (inventory_incoming i_1
             LEFT JOIN inventory_outgoing io ON ((i_1.id = io.incoming_id)))
          GROUP BY i_1.id) o ON ((i.id = o.incoming_id)))
  GROUP BY p.id;

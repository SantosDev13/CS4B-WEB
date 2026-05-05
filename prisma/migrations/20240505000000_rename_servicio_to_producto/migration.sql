-- Rename categoria_servicio to categoria_producto
ALTER TABLE IF EXISTS categorias_servicios RENAME TO categorias_productos;

-- Rename columns in categorias_productos (no column changes, just table rename)

-- Rename servicio to producto
ALTER TABLE IF EXISTS servicios RENAME TO productos;

-- Rename foreign key column
ALTER TABLE IF EXISTS productos RENAME COLUMN categoria_servicio_id TO categoria_producto_id;

-- Rename index if exists
ALTER INDEX IF EXISTS servicios_categoria_servicio_id_fkey RENAME TO productos_categoria_producto_id_fkey;

-- Rename unique constraint if exists
ALTER INDEX IF EXISTS servicios_categoria_servicio_id_idx RENAME TO productos_categoria_producto_id_idx;
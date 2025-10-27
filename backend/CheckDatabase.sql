-- =============================================
-- Quick Database Check Script
-- Sử dụng script này để kiểm tra database sau khi tạo
-- =============================================

USE CarRentalDb;
GO

PRINT '========================================';
PRINT 'KIỂM TRA DATABASE: CarRentalDb';
PRINT '========================================';
PRINT '';

-- 1. Kiểm tra các bảng
PRINT '1. DANH SÁCH CÁC BẢNG:';
PRINT '----------------------------------------';
SELECT 
    t.name AS TableName,
    SUM(p.rows) AS RowCount
FROM 
    sys.tables t
INNER JOIN 
    sys.partitions p ON t.object_id = p.object_id
WHERE 
    p.index_id IN (0,1)
    AND t.is_ms_shipped = 0
GROUP BY 
    t.name
ORDER BY 
    t.name;
GO

PRINT '';
PRINT '2. DỮ LIỆU TRONG CÁC BẢNG:';
PRINT '----------------------------------------';

-- Roles
PRINT 'Roles:';
SELECT Id, Name, Description FROM Roles;
PRINT '';

-- Categories
PRINT 'Categories:';
SELECT Id, Name, Description FROM Categories;
PRINT '';

-- Users
PRINT 'Users:';
SELECT Id, FirstName, LastName, Email, PhoneNumber, IsActive, RoleId FROM Users;
PRINT '';

-- Vehicles
PRINT 'Vehicles:';
SELECT Id, Make, Model, Year, LicensePlate, DailyRate, Status, CategoryId FROM Vehicles;
PRINT '';

-- 3. Kiểm tra Foreign Keys
PRINT '3. FOREIGN KEY CONSTRAINTS:';
PRINT '----------------------------------------';
SELECT 
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable,
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferencedColumn
FROM 
    sys.foreign_keys AS fk
INNER JOIN 
    sys.foreign_key_columns AS fc ON fk.object_id = fc.constraint_object_id
ORDER BY 
    TableName, ForeignKeyName;
GO

-- 4. Kiểm tra Indexes
PRINT '';
PRINT '4. INDEXES:';
PRINT '----------------------------------------';
SELECT 
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType
FROM 
    sys.indexes i
WHERE 
    i.object_id IN (SELECT object_id FROM sys.tables WHERE is_ms_shipped = 0)
    AND i.name IS NOT NULL
ORDER BY 
    TableName, IndexName;
GO

-- 5. Test View
PRINT '';
PRINT '5. DASHBOARD STATISTICS:';
PRINT '----------------------------------------';
SELECT * FROM vw_DashboardStats;
GO

-- 6. Test Stored Procedure
PRINT '';
PRINT '6. TEST AVAILABLE VEHICLES (Kiểm tra xe available từ hôm nay + 7 ngày):';
PRINT '----------------------------------------';
DECLARE @StartDate DATETIME2 = GETUTCDATE();
DECLARE @EndDate DATETIME2 = DATEADD(DAY, 7, GETUTCDATE());
EXEC sp_GetAvailableVehicles @StartDate, @EndDate;
GO

PRINT '';
PRINT '========================================';
PRINT 'KIỂM TRA HOÀN TẤT!';
PRINT '========================================';

-- Thêm cột PickupLocationId và ReturnLocationId vào bảng Bookings
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'PickupLocationId')
BEGIN
    ALTER TABLE Bookings ADD PickupLocationId INT NULL;
    ALTER TABLE Bookings ADD CONSTRAINT FK_Bookings_PickupLocation FOREIGN KEY (PickupLocationId) REFERENCES Locations(Id);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'ReturnLocationId')
BEGIN
    ALTER TABLE Bookings ADD ReturnLocationId INT NULL;
    ALTER TABLE Bookings ADD CONSTRAINT FK_Bookings_ReturnLocation FOREIGN KEY (ReturnLocationId) REFERENCES Locations(Id);
END
GO

-- Tạo bảng Locations nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Locations')
BEGIN
    CREATE TABLE Locations (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(200) NOT NULL,
        Address NVARCHAR(500) NOT NULL,
        Latitude FLOAT NOT NULL,
        Longitude FLOAT NOT NULL,
        PhoneNumber NVARCHAR(20),
        Description NVARCHAR(1000),
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

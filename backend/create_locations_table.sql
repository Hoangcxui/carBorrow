-- Create Locations table and update Bookings
USE CarRentalDb;
GO

-- Create Locations table if not exists
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Locations]') AND type in (N'U'))
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
    PRINT 'Locations table created';
END
ELSE
BEGIN
    PRINT 'Locations table already exists';
END
GO

-- Add columns to Bookings if not exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND name = 'PickupLocationId')
BEGIN
    ALTER TABLE Bookings ADD PickupLocationId INT NULL;
    PRINT 'Added PickupLocationId column';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND name = 'DropoffLocationId')
BEGIN
    ALTER TABLE Bookings ADD DropoffLocationId INT NULL;
    PRINT 'Added DropoffLocationId column';
END
GO

-- Insert 4 HUFLIT campuses
IF NOT EXISTS (SELECT * FROM Locations)
BEGIN
    INSERT INTO Locations (Name, Address, Latitude, Longitude, PhoneNumber, Description, IsActive, CreatedAt) VALUES
    ('HUFLIT - Cơ sở Sư Vạn Hạnh (Main Campus)', '828 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', 10.7714, 106.6653, '028 3863 6636', 'Cơ sở chính - Trụ sở Hành chính và Học tập', 1, GETUTCDATE()),
    ('HUFLIT - Cơ sở Trường Sơn', '32 Trường Sơn, Phường 4, Quận Tân Bình, TP.HCM', 10.8013, 106.6582, '028 3844 0091', 'Cơ sở học tập và thực hành gần sân bay', 1, GETUTCDATE()),
    ('HUFLIT - Cơ sở Ba Gia', '52-70 Ba Gia, Phường 2, Quận Tân Bình, TP.HCM', 10.8025, 106.6519, '028 3842 3377', 'Cơ sở phụ trợ và hoạt động sinh viên', 1, GETUTCDATE()),
    ('HUFLIT - Cơ sở Hóc Môn', '806 Lê Quang Đạo, Phường Tân Thới Nhất, Quận 12, TP.HCM', 10.8547, 106.6271, '028 3755 5555', 'Cơ sở mở rộng và đào tạo từ xa', 1, GETUTCDATE());
    PRINT 'Inserted 4 HUFLIT locations';
END
ELSE
BEGIN
    PRINT 'Locations already exist';
END
GO

-- Add foreign key constraints
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Locations_PickupLocationId')
BEGIN
    ALTER TABLE Bookings
    ADD CONSTRAINT FK_Bookings_Locations_PickupLocationId
    FOREIGN KEY (PickupLocationId) REFERENCES Locations(Id);
    PRINT 'Added FK for PickupLocationId';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Locations_DropoffLocationId')
BEGIN
    ALTER TABLE Bookings
    ADD CONSTRAINT FK_Bookings_Locations_DropoffLocationId
    FOREIGN KEY (DropoffLocationId) REFERENCES Locations(Id);
    PRINT 'Added FK for DropoffLocationId';
END
GO

-- Verify
SELECT COUNT(*) AS LocationCount FROM Locations;
GO

PRINT 'Database update completed successfully!';
GO

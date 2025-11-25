-- Update database schema to add Location relationships to Booking table
USE CarRentalDb;
GO

-- Add new columns for Location relationships
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND name = 'PickupLocationId')
BEGIN
    ALTER TABLE Bookings ADD PickupLocationId INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND name = 'DropoffLocationId')
BEGIN
    ALTER TABLE Bookings ADD DropoffLocationId INT NULL;
END
GO

-- Add foreign key constraints
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Locations_PickupLocationId')
BEGIN
    ALTER TABLE Bookings
    ADD CONSTRAINT FK_Bookings_Locations_PickupLocationId
    FOREIGN KEY (PickupLocationId) REFERENCES Locations(Id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Locations_DropoffLocationId')
BEGIN
    ALTER TABLE Bookings
    ADD CONSTRAINT FK_Bookings_Locations_DropoffLocationId
    FOREIGN KEY (DropoffLocationId) REFERENCES Locations(Id);
END
GO

-- Clear old location data if exists
TRUNCATE TABLE Locations;
GO

-- Insert 4 HUFLIT campuses with correct addresses
INSERT INTO Locations (Name, Address, Latitude, Longitude, PhoneNumber, Description, IsActive, CreatedAt) VALUES
('HUFLIT - Cơ sở Sư Vạn Hạnh (Main Campus)', '828 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', 10.7714, 106.6653, '028 3863 6636', 'Cơ sở chính - Trụ sở Hành chính và Học tập', 1, GETUTCDATE()),
('HUFLIT - Cơ sở Trường Sơn', '32 Trường Sơn, Phường 4, Quận Tân Bình, TP.HCM', 10.8013, 106.6582, '028 3844 0091', 'Cơ sở học tập và thực hành gần sân bay', 1, GETUTCDATE()),
('HUFLIT - Cơ sở Ba Gia', '52-70 Ba Gia, Phường 2, Quận Tân Bình, TP.HCM', 10.8025, 106.6519, '028 3842 3377', 'Cơ sở phụ trợ và hoạt động sinh viên', 1, GETUTCDATE()),
('HUFLIT - Cơ sở Hóc Môn', '806 Lê Quang Đạo, Phường Tân Thới Nhất, Quận 12, TP.HCM', 10.8547, 106.6271, '028 3755 5555', 'Cơ sở mở rộng và đào tạo từ xa', 1, GETUTCDATE());
GO

PRINT 'Database schema updated successfully!';
PRINT 'Added PickupLocationId and DropoffLocationId columns to Bookings table';
PRINT 'Inserted 4 HUFLIT campus locations';
GO

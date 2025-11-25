-- Create VerificationCodes table
CREATE TABLE VerificationCodes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL,
    Code NVARCHAR(10) NOT NULL,
    Purpose NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2 NOT NULL,
    IsUsed BIT NOT NULL DEFAULT 0
);

-- Create index for fast lookups
CREATE INDEX IX_VerificationCodes_Email_Code_Purpose 
ON VerificationCodes (Email, Code, Purpose);

GO

using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class CarRentalDbContext : DbContext
    {
        public CarRentalDbContext(DbContextOptions<CarRentalDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<Rental> Rentals { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Role configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(255);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            // Vehicle configuration
            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.LicensePlate).IsUnique();
                entity.Property(e => e.Make).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Model).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LicensePlate).IsRequired().HasMaxLength(20);
                entity.Property(e => e.DailyRate).HasColumnType("decimal(10,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Vehicles)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // VehicleImage configuration
            modelBuilder.Entity<VehicleImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImagePath).IsRequired().HasMaxLength(500);
                entity.Property(e => e.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.Vehicle)
                      .WithMany(v => v.Images)
                      .HasForeignKey(e => e.VehicleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Rental configuration
            modelBuilder.Entity<Rental>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalCost).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Rentals)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                      
                entity.HasOne(e => e.Vehicle)
                      .WithMany(v => v.Rentals)
                      .HasForeignKey(e => e.VehicleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // RefreshToken configuration
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Token).IsRequired();
                entity.Property(e => e.Created).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.User)
                      .WithMany(u => u.RefreshTokens)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // AuditLog configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Details).HasMaxLength(500);
                entity.Property(e => e.EntityType).HasMaxLength(50);
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.User)
                      .WithMany(u => u.AuditLogs)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}

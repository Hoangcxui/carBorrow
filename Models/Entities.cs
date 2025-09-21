using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; } // Admin, Staff, Customer
        public bool IsEmailConfirmed { get; set; }
        public string? EmailVerificationToken { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Booking>? Bookings { get; set; }
        public ICollection<AuditLog>? AuditLogs { get; set; }
        public ICollection<RefreshToken>? RefreshTokens { get; set; }
    }

    public class Vehicle
    {
        public Guid Id { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int Year { get; set; }
        public string? Type { get; set; }
        public int Seats { get; set; }
        public string? Transmission { get; set; }
        public string? FuelType { get; set; }
        public decimal PricePerDay { get; set; }
        public Guid LocationId { get; set; }
        public Location? Location { get; set; }
        public string? Status { get; set; } // Available, Rented, Maintenance
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<VehicleImage>? Images { get; set; }
        public ICollection<Booking>? Bookings { get; set; }
        public ICollection<MaintenanceRecord>? MaintenanceRecords { get; set; }
    }

    public class VehicleImage
    {
        public Guid Id { get; set; }
        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public string Url { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class Location
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public ICollection<Vehicle>? Vehicles { get; set; }
    }

    public class Booking
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public Guid PickUpLocationId { get; set; }
        public Location? PickUpLocation { get; set; }
        public Guid DropOffLocationId { get; set; }
        public Location? DropOffLocation { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<BookingItem>? BookingItems { get; set; }
        public Payment? Payment { get; set; }
        public Invoice? Invoice { get; set; }
    }

    public class BookingItem
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Booking? Booking { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
    }

    public class Payment
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Booking? Booking { get; set; }
        public decimal Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentStatus { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class Invoice
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Booking? Booking { get; set; }
        public string? InvoiceNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime IssuedAt { get; set; }
    }

    public class AuditLog
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string? Action { get; set; }
        public string? Detail { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class MaintenanceRecord
    {
        public Guid Id { get; set; }
        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public string? Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Notes { get; set; }
    }

    public class RefreshToken
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string? Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
    }
}

using AutoMapper;
using backend.Models;
using backend.DTOs;

namespace backend.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Name));
            CreateMap<User, RegisterDto>().ReverseMap()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            CreateMap<User, LoginDto>().ReverseMap();

            // Vehicle mappings
            CreateMap<Vehicle, VehicleDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.Status == "Available"));
            
            CreateMap<Vehicle, CreateVehicleDto>().ReverseMap()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Available"));

            // Category mappings
            CreateMap<Category, CategoryDto>().ReverseMap();

            // Booking mappings (formerly Rental)
            CreateMap<Booking, BookingDto>()
                .ForMember(dest => dest.VehicleMake, opt => opt.MapFrom(src => src.Vehicle.Make))
                .ForMember(dest => dest.VehicleModel, opt => opt.MapFrom(src => src.Vehicle.Model))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email));
            
            CreateMap<CreateBookingDto, Booking>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"));
        }
    }
}

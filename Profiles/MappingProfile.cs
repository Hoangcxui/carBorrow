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
            CreateMap<User, RegisterDto>().ReverseMap()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            CreateMap<User, LoginDto>().ReverseMap();

            // Vehicle mappings
            CreateMap<Vehicle, VehicleDto>().ReverseMap();
            CreateMap<Vehicle, CreateVehicleDto>().ReverseMap()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => true));

            // Category mappings
            CreateMap<Category, CategoryDto>().ReverseMap();

            // Role mappings
            CreateMap<Role, RoleDto>().ReverseMap();

            // Rental mappings
            CreateMap<Rental, RentalDto>().ReverseMap();
            CreateMap<Rental, CreateRentalDto>().ReverseMap()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}

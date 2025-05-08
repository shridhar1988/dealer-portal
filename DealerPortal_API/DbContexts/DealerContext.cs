using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;
using DealerPortal_API.Models;

namespace DealerPortal_API.DbContexts
{
    public class DealerContext:DbContext
    {
        public DealerContext(DbContextOptions<DealerContext> options) : base(options) { }

        public DbSet<Company> Company { get; set; }
        public DbSet<Plant> Plant { get; set; }
        public DbSet<CompanyPlantMapping> CompanyPlantMapping { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRoleMap> UserRoleMaps { get; set; }
        public DbSet<App> Apps { get; set; }
        public DbSet<RoleAppMap> RoleAppMaps { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistory { get; set; }
        public DbSet<AuthTokenHistory> AuthTokenHistories { get; set; }
        public DbSet<EmailConfiguration> EmailConfiguration { get; set; }
        public DbSet<otpConfiguration> otpConfiguration { get; set; }
        public DbSet<PasswordResetOtpHistory> PasswordResetOtpHistorys { get; set; }
        public DbSet<EmpInfo> EmpInfos { get; set; }
        public DbSet<MailBodyConfiguration> MailBodyConfigurations { get; set; }

        public DbSet<ManagerUserMap> ManagerUserMaps { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoleAppMap>(
           build =>
           {
               build.HasKey(t => new { t.RoleID, t.AppID });
           });
            modelBuilder.Entity<UserRoleMap>(
            build =>
            {
                build.HasKey(t => new { t.UserID, t.RoleID });
            });
        }

    }

}

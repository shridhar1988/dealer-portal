using Microsoft.EntityFrameworkCore;
using static Ticketing_API.Models.AuthMaster;
using Ticketing_API.Models;

namespace Ticketing_API.DbContexts
{
    public class DealerPortalContext:DbContext
    {
        public DealerPortalContext(DbContextOptions<DealerPortalContext> options) : base(options) { }

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

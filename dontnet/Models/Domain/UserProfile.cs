using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class UserProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Mi { get; set; }

        public string AvatarUrl { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public string Email { get; set; }  
    }
}

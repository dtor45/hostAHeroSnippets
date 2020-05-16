using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.User_Profiles
{
    public class UserProfileAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LastName { get; set; }

        [StringLength(2)]
        public string Mi { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string AvatarUrl { get; set; }
    }
}

using Sabio.Models.Requests.User_Profiles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.UserProfiles
{
    public class UserProfileUpdateRequest : UserProfileAddRequest , IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}

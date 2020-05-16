using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.UserProfileReviews
{
    public class UserProfileReviewUpdateRequest : UserProfileReviewAddRequest, IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}

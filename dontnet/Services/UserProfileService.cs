using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.User_Profiles;
using Sabio.Models.Requests.UserProfiles;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class UserProfileService : IUserProfileService
    {
        private IDataProvider _data = null;

        public UserProfileService(IDataProvider data)
        {
            _data = data;
        }

        public UserProfile GetById(int id)
        {
            string procName = "[dbo].[UserProfiles_SelectById_V2]";

            UserProfile aUserProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfile(reader);
            });

            return aUserProfile;
        }

        public UserProfileAdditionalInfo GetByIdV2(int id)
        {
            string procName = "[dbo].[UserProfiles_SelectById_V3]";

            UserProfileAdditionalInfo aUserProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfileV2(reader);
            });

            return aUserProfile;
        }

        public int Add(UserProfileAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[UserProfiles_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParameters(model, paramCol);
                paramCol.AddWithValue("@UserId", userId);

                SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                idOutput.Direction = ParameterDirection.Output;

                paramCol.Add(idOutput);
            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object outputId = returnCol["@Id"].Value;

                int.TryParse(outputId.ToString(), out id);
            });

            return id;
        }

        public void Update(UserProfileUpdateRequest model)
        {
            string procName = "[dbo].[UserProfiles_Update_V2]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParameters(model, paramCol);

                paramCol.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }
        public List<UserProfile> GetAll(int userId)
        {
            List<UserProfile> list = null;

            UserProfile aUserProfile = null;

            string procName = "[dbo].[UserProfiles_SelectAll_forMessages_V3]";

            _data.ExecuteCmd(procName, inputParamMapper : delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@UserId", userId);
            }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfile(reader);

                if (list == null)
                {
                    list = new List<UserProfile>();
                }

                list.Add(aUserProfile);
            });



            return list;
        }
        public Paged<UserProfileAdditionalInfo> GetAllPaginated(int pageIndex, int pageSize)
        {
            Paged<UserProfileAdditionalInfo> pagedList = null;

            List<UserProfileAdditionalInfo> list = null;

            UserProfileAdditionalInfo aUserProfile = null;

            int totalCount = 0;

            string procName = "[dbo].[UserProfiles_SelectAll_V3]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfileV3(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(12);
                }

                if (list == null)
                {
                    list = new List<UserProfileAdditionalInfo>();
                }

                list.Add(aUserProfile);
            });

            if (list != null)
            {
                pagedList = new Paged<UserProfileAdditionalInfo>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[UserProfiles_DeleteById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public Paged<UserProfile> GetByCreatedBy(int userId, int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedList = null;

            List<UserProfile> list = null;

            UserProfile aUserProfile = null;

            int totalCount = 0;

            string procName = "[dbo].[UserProfiles_SelectByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
                paramCol.AddWithValue("@UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfile(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(9);
                }

                if (list == null)
                {
                    list = new List<UserProfile>();
                }

                list.Add(aUserProfile);
            });

            if (list != null)
            {
                pagedList = new Paged<UserProfile>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public UserProfile GetByCreatedByV2(int userId)
        {
            string procName = "[dbo].[UserProfiles_SelectByCreatedByV2]";

            UserProfile aUserProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfile(reader);
            });

            return aUserProfile;
        }

        public UserProfileAdditionalInfo GetByCreatedByV3(int userId)
        {
            string procName = "dbo.UserProfiles_SelectByCreatedByV3";

            UserProfileAdditionalInfo aUserProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfileV2(reader);
            });

            return aUserProfile;
        }

        public Paged<UserProfileAdditionalInfo> GetAllBySearch(string searchQuery, int pageIndex, int pageSize)
        {
            Paged<UserProfileAdditionalInfo> pagedList = null;

            List<UserProfileAdditionalInfo> list = null;

            UserProfileAdditionalInfo aUserProfile = null;

            int totalCount = 0;

            string procName = "[dbo].[UserProfiles_SelectAll_BySearchQuery_V2]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
                paramCol.AddWithValue("@SearchQuery", searchQuery);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfileV3(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(12);
                }

                if (list == null)
                {
                    list = new List<UserProfileAdditionalInfo>();
                }

                list.Add(aUserProfile);
            });

            if (list != null)
            {
                pagedList = new Paged<UserProfileAdditionalInfo>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public UserProfileNoId GetByUserId(int userId)
        {
            string procName = "dbo.UserProfiles_SelectByUserId";

            UserProfileNoId aUserProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                aUserProfile = MapSingleUserProfileWithOutId(reader);
            });

            return aUserProfile;
        }

        private static UserProfile MapSingleUserProfile(IDataReader reader)
        {
            UserProfile aUserProfile = new UserProfile();

            int initialIndex = 0;

            aUserProfile.Id = reader.GetSafeInt32(initialIndex++);
            aUserProfile.UserId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.FirstName = reader.GetSafeString(initialIndex++);
            aUserProfile.LastName = reader.GetSafeString(initialIndex++);
            aUserProfile.Mi = reader.GetSafeString(initialIndex++);
            aUserProfile.AvatarUrl = reader.GetSafeString(initialIndex++);
            aUserProfile.DateCreated = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.DateModified = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.Email = reader.GetSafeString(initialIndex++);

            return aUserProfile;
        }

        private static UserProfileNoId MapSingleUserProfileWithOutId(IDataReader reader)
        {
            UserProfileNoId aUserProfile = new UserProfileNoId();

            int initialIndex = 0;
            aUserProfile.UserProfileId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.UserId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.FirstName = reader.GetSafeString(initialIndex++);
            aUserProfile.LastName = reader.GetSafeString(initialIndex++);
            aUserProfile.Mi = reader.GetSafeString(initialIndex++);
            aUserProfile.AvatarUrl = reader.GetSafeString(initialIndex++);
            aUserProfile.DateCreated = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.DateModified = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.Email = reader.GetSafeString(initialIndex++);

            return aUserProfile;
        }

        private static UserProfileAdditionalInfo MapSingleUserProfileV2(IDataReader reader)
        {
            UserProfileAdditionalInfo aUserProfile = new UserProfileAdditionalInfo();

            int initialIndex = 0;

            aUserProfile.Id = reader.GetSafeInt32(initialIndex++);
            aUserProfile.UserId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.FirstName = reader.GetSafeString(initialIndex++);
            aUserProfile.LastName = reader.GetSafeString(initialIndex++);
            aUserProfile.Mi = reader.GetSafeString(initialIndex++);
            aUserProfile.AvatarUrl = reader.GetSafeString(initialIndex++);
            aUserProfile.DateCreated = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.DateModified = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.Email = reader.GetSafeString(initialIndex++);
            aUserProfile.VeteranStatus = reader.GetSafeString(initialIndex++);
            aUserProfile.UserStatus = reader.GetSafeString(initialIndex++);

            return aUserProfile;
        }

        private static UserProfileAdditionalInfo MapSingleUserProfileV3(IDataReader reader)
        {
            UserProfileAdditionalInfo aUserProfile = new UserProfileAdditionalInfo();

            int initialIndex = 0;

            aUserProfile.Id = reader.GetSafeInt32(initialIndex++);
            aUserProfile.UserId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.FirstName = reader.GetSafeString(initialIndex++);
            aUserProfile.LastName = reader.GetSafeString(initialIndex++);
            aUserProfile.Mi = reader.GetSafeString(initialIndex++);
            aUserProfile.AvatarUrl = reader.GetSafeString(initialIndex++);
            aUserProfile.DateCreated = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.DateModified = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.Email = reader.GetSafeString(initialIndex++);
            aUserProfile.MembershipStatus = reader.GetSafeString(initialIndex++);
            aUserProfile.VeteranStatus = reader.GetSafeString(initialIndex++);
            aUserProfile.UserStatus = reader.GetSafeString(initialIndex++);

            return aUserProfile;
        }

        private static UserProfile MapProfileNoEmail(IDataReader reader)
        {
            UserProfile aUserProfile = new UserProfile();

            int initialIndex = 0;

            aUserProfile.Id = reader.GetSafeInt32(initialIndex++);
            aUserProfile.UserId = reader.GetSafeInt32(initialIndex++);
            aUserProfile.FirstName = reader.GetSafeString(initialIndex++);
            aUserProfile.LastName = reader.GetSafeString(initialIndex++);
            aUserProfile.Mi = reader.GetSafeString(initialIndex++);
            aUserProfile.AvatarUrl = reader.GetSafeString(initialIndex++);
            aUserProfile.DateCreated = reader.GetSafeDateTime(initialIndex++);
            aUserProfile.DateModified = reader.GetSafeDateTime(initialIndex++);

            return aUserProfile;
        }

        private static void AddCommonParameters(UserProfileAddRequest model, SqlParameterCollection paramCol)
        {
            paramCol.AddWithValue("@FirstName", model.FirstName);
            paramCol.AddWithValue("@LastName", model.LastName);
            paramCol.AddWithValue("@Mi", model.Mi);
            paramCol.AddWithValue("@AvatarUrl", model.AvatarUrl);
        }
    }
}
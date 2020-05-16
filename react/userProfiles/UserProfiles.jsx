import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import UserProfileCard from "./UserProfileCard";
import UserProfileForm from "./UserProfileForm";
import UserProfileSearch from "./UserProfileSearch.jsx";
import * as profileService from "../../services/userProfilesService";
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";
import logger from "sabio-debug";

const _logger = logger.extend("UserProfiles");

const defaultUserProfilePic =
  "https://sabio-training.s3-us-west-2.amazonaws.com/HostAHero/1a4df426-b23d-4334-9ed5-70c76ef1af9c/defaultUserProfilePic.png";

class UserProfiles extends React.Component {
  state = {
    profiles: [],
    editProfile: {},
    activePage: 1,
    numProfilesPerPage: 4,
    totalNumOfProfiles: 0,
    numDisplayedPages: 5,
    isSearching: false,
    fromSearch: "",
    editedInfo: {},
    profilesError: false,
    shouldFormDisplay: false
  };

  mapSingleUserProfileCard = singleUser => {
    return (
      <UserProfileCard
        key={"UserProfile_" + singleUser.id}
        userProfile={singleUser}
        edit={this.populateFormFields}
        delete={this.confirmDelete}
      />
    );
  };

  mapProfiles = () => {
    let array = this.state.profiles.map(this.mapSingleUserProfileCard);
    return array;
  };

  populateFormFields = userProfileObj => {
    this.setState(() => {
      const editProfile = userProfileObj;
      return { editProfile };
    });

    this.setState(() => {
      return { shouldFormDisplay: true };
    });
  };

  clearEditProfile = () => {
    this.setState(() => {
      const editProfile = {};
      return { editProfile };
    });
  };

  goToUserProfilesFromForm = () => {
    this.setState(() => {
      return { shouldFormDisplay: false };
    });
    this.clearEditProfile();
  };

  addOrUpdateUserProfile = profileInfo => {
    if (profileInfo.avatarUrl === "") {
      profileInfo.avatarUrl = defaultUserProfilePic;
    }

    if (Object.getOwnPropertyNames(this.state.editProfile).length === 0) {
      profileService
        .postNewUserProfile(profileInfo)
        .then(this.onPostNewSuccess)
        .catch(this.onPostNewError);
    } else {
      this.setState(() => {
        return { editedInfo: profileInfo };
      });
      this.profileUpdater(profileInfo);
    }
  };

  profileUpdater = userProfileObj => {
    _logger("profileUpdater");
    profileService
      .updateUserProfile(this.state.editProfile.id, userProfileObj)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateError);
  };

  onUpdateSuccess = () => {
    toast("User Profile Updated Successfully!");

    this.setState(prevState => {
      let _state = { ...prevState };
      const updatedInfo = _state.editedInfo;
      let profiles = _state.profiles;

      for (const userProfile of profiles) {
        if (userProfile.id === _state.editProfile.id) {
          userProfile.firstName = updatedInfo.firstName;
          userProfile.mi = updatedInfo.mi;
          userProfile.lastName = updatedInfo.lastName;
          userProfile.avatarUrl = updatedInfo.avatarUrl;
        }
      }

      const editedInfo = {};
      return { profiles, editedInfo };
    });

    this.goToUserProfilesFromForm();
  };

  onUpdateError = err => {
    _logger(err);
    this.errorToast();
    this.setState(() => {
      const editedInfo = {};
      return { editedInfo };
    });
  };

  onPostNewSuccess = () => {
    toast("User Profile Added Successfully!");
    this.goToUserProfilesFromForm();
    this.getAllUserProfilesCall(
      this.state.activePage - 1,
      this.state.numProfilesPerPage
    );
  };

  onPostNewError = err => {
    _logger(err);
    this.errorToast();
  };

  errorToast = () => {
    toast("Something went wrong! Please try again.");
  };

  confirmDelete = profile => {
    Swal.fire({
      title: "Are your sure?",
      text: "User Profile will be deleted forever.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    }).then(value => {
      if (value.value) {
        profileService
          .deleteUserProfile(profile.id)
          .then(this.onDeleteSuccess)
          .catch(this.onDeleteError);
      } else {
        toast("User profile NOT deleted");
      }
    });
  };

  onDeleteSuccess = () => {
    _logger("delete success");
    toast("User Profile Deleted Successfully!");
    this.getAllUserProfilesCall(
      this.state.activePage - 1,
      this.state.numProfilesPerPage
    );
  };

  onDeleteError = err => {
    _logger(err);
    this.errorToast();
  };

  getAllUserProfilesCall = (pageIndex, pageSize) => {
    profileService
      .getAll(pageIndex, pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onGetAllSuccess = response => {
    let { item } = response.data;

    this.setState(() => {
      let profiles = item.pagedItems;
      let totalNumOfProfiles = item.totalCount;
      let isSearching = false;
      let profilesError = false;

      return { profiles, totalNumOfProfiles, isSearching, profilesError };
    });
  };

  onGetAllError = err => {
    _logger(err);
    this.errorToast();
    this.setState(() => {
      return { profilesError: true };
    });
  };

  handlePageChange = pageNumber => {
    this.setState(() => {
      let activePage = pageNumber;

      return { activePage };
    });

    let { numProfilesPerPage } = this.state;

    if (!this.state.isSearching) {
      this.getAllUserProfilesCall(pageNumber - 1, numProfilesPerPage);
    } else {
      profileService
        .searchProfiles(
          pageNumber - 1,
          numProfilesPerPage,
          this.state.fromSearch
        )
        .then(this.onSearchProfilesSuccess)
        .catch(this.onSearchProfilesError);
    }
  };

  onSearchProfilesSuccess = response => {
    let { pagedItems } = response.data.item;

    this.setState(() => {
      let profiles = pagedItems;
      return { profiles };
    });
  };

  onSearchProfilesError = err => {
    _logger(err);
    this.errorToast();
  };

  setUpForSearch = (responseObj, searchTerm) => {
    this.setState(() => {
      let profiles = responseObj.pagedItems;
      let activePage = 1;
      let totalNumOfProfiles = responseObj.totalCount;
      let isSearching = true;
      let fromSearch = searchTerm;

      return {
        profiles,
        activePage,
        totalNumOfProfiles,
        isSearching,
        fromSearch
      };
    });
  };

  clearSearch = () => {
    this.setState(() => {
      let activePage = 1;
      let fromSearch = "";

      return { activePage, fromSearch };
    });
    this.getAllUserProfilesCall(0, this.state.numProfilesPerPage);
  };

  removeAvatar = userProfileObj => {
    if (userProfileObj.avatarUrl !== defaultUserProfilePic) {
      userProfileObj.avatarUrl = defaultUserProfilePic;

      this.setState(() => {
        const editedInfo = userProfileObj;
        return { editedInfo };
      });

      this.profileUpdater(userProfileObj);
    } else {
      toast("Sorry! You can't remove the default picture.");
    }
  };

  componentDidMount() {
    this.getAllUserProfilesCall(
      this.state.activePage - 1,
      this.state.numProfilesPerPage
    );
  }

  render() {
    _logger("rendering");

    return (
      <React.Fragment>
        <div className="app-page-title">
          <div className="page-title-wrapper d-flex">
            <div className="page-title-heading">
              <div className="page-title-icon">
                <i className="pe-7s-id icon-gradient bg-happy-itmeo" />
              </div>
              <div>
                <h3>User Profiles</h3>
                <div className="page-title-subheading">
                  List of user profiles.
                </div>
              </div>
            </div>
            <div className="ml-auto">
              {!this.state.shouldFormDisplay ? (
                <UserProfileSearch
                  profilesPerPage={this.state.numProfilesPerPage}
                  setUpForSearch={this.setUpForSearch}
                  isSearching={this.state.isSearching}
                  clearSearch={this.clearSearch}
                />
              ) : null}
            </div>
          </div>
        </div>
        {!this.state.shouldFormDisplay ? (
          <div>
            <Row>
              {this.state.profiles.length !== 0 ? (
                this.mapProfiles()
              ) : this.state.profilesError ? (
                <Col>
                  <div
                    className="d-flex justify-content-center"
                    style={{ textAlign: "center" }}
                  >
                    <h1>
                      No User Profiles found. There may have been error. Please
                      refresh the page. If problem persists, please contact the
                      administrator.
                    </h1>
                  </div>
                </Col>
              ) : (
                <Col sm="12" className="d-flex justify-content-center">
                  <div className="loader-wrapper d-flex justify-content-center align-items-center">
                    <div className="loader loader-undefined loader-active">
                      <div className="loader-inner line-scale">
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <Row className="d-flex justify-content-center">
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.numProfilesPerPage}
                totalItemsCount={this.state.totalNumOfProfiles}
                pageRangeDisplayed={this.state.numDisplayedPages}
                onChange={this.handlePageChange}
              />
            </Row>
          </div>
        ) : (
          <div>
            <Row>
              <Col sm={{ size: 8, offset: 2 }} className="mb-3">
                <UserProfileForm
                  cancel={this.goToUserProfilesFromForm}
                  submit={this.addOrUpdateUserProfile}
                  editProfile={this.state.editProfile}
                  removeAvatar={this.removeAvatar}
                />
              </Col>
            </Row>
          </div>
        )}
      </React.Fragment>
    );
  }
}

UserProfiles.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(UserProfiles);

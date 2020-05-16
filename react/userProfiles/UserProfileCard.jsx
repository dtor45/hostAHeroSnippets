import React from "react";
import { Col, Card, CardBody, CardFooter, Button, Row } from "reactstrap";
import styles from "./userProfiles.module.css";
import PropTypes from "prop-types";

class UserProfileCard extends React.Component {
  state = {
    isActive: false
  };

  onEditClick = e => {
    e.preventDefault();
    this.props.edit(this.props.userProfile);
  };

  onDeleteClick = e => {
    e.preventDefault();
    this.props.delete(this.props.userProfile);
  };

  handleDetailsClick = e => {
    e.preventDefault();
    this.setState(() => {
      let isActive = !this.state.isActive;
      return { isActive };
    });
  };

  showOrHide = () => {
    if (this.state.isActive) {
      return "Hide Details";
    } else {
      return "Show Details";
    }
  };

  displayStatus = statusToBeDisplayed => {
    if (statusToBeDisplayed === null) {
      return "Null";
    } else {
      return statusToBeDisplayed;
    }
  };

  render() {
    let { userProfile } = this.props;

    return (
      <Col sm="3" className="mt-3 mb-3">
        <Card className="card-hover-shadow card-border bg-primary">
          <CardBody>
            <div className="d-flex justify-content-center">
              <div className="avatar-icon-wrapper avatar-icon-xl">
                <div className="avatar-icon">
                  <img
                    style={{ objectFit: "cover" }}
                    src={this.props.userProfile.avatarUrl}
                    alt={userProfile.firstName.concat(
                      " ",
                      userProfile.lastName
                    )}
                  />
                </div>
              </div>
            </div>
            <div>
              <Row className="d-flex justify-content-center text-white">
                <h5>
                  {userProfile.firstName} {userProfile.lastName}
                </h5>
              </Row>
              <Row className="d-flex justify-content-center mb-3">
                <Button
                  className={styles.detailsButton}
                  onClick={this.handleDetailsClick}
                >
                  {this.showOrHide()}
                </Button>
              </Row>
            </div>
            <div
              className={
                this.state.isActive === true ? "mb-1" : styles.inactiveDetails
              }
            >
              <ul className="pl-2 text-white">
                <li>Email: {userProfile.email}</li>
                <li>
                  <a
                    href={`/user/profile/${userProfile.id}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-white"
                  >
                    Profile Page
                  </a>
                </li>
                <li>
                  Membership Status:{" "}
                  {this.displayStatus(userProfile.membershipStatus)}
                </li>
                <li>
                  User Status: {this.displayStatus(userProfile.userStatus)}
                </li>
              </ul>
            </div>
          </CardBody>
          <CardFooter className="d-flex justify-content-between bg-primary">
            <button
              className="btn-shadow-dark btn-wider btn btn-info"
              onClick={this.onEditClick}
            >
              Edit
            </button>
            <button
              className="btn-shadow-dark btn-wider btn btn-danger"
              onClick={this.onDeleteClick}
            >
              Delete
            </button>
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

UserProfileCard.propTypes = {
  userProfile: PropTypes.shape({
    veteranStatus: PropTypes.string,
    userStatus: PropTypes.string,
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    avatarUrl: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    membershipStatus: PropTypes.string.isRequired
  }).isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

export default UserProfileCard;

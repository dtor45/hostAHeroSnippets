import React from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Card,
  Container,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import PropTypes from "prop-types";
import { Formik, Field } from "formik";
import { userProfileFormSchema } from "./validationSchema";
import FileUpload from "../files/FileUpload";
import logger from "sabio-debug";
import { toast } from "react-toastify";

const _logger = logger.extend("UserProfileForm");

class UserProfileForm extends React.Component {
  state = {
    formFields: {
      firstName: "",
      mi: "",
      lastName: "",
      avatarUrl: ""
    },
    activeKey: "1",
    isEdit: false,
    isChecked: false,
    isFileSubmitted: false
  };

  onCancelClick = e => {
    e.preventDefault();
    this.props.cancel();
  };

  checkIfEdit = () => {
    let { editProfile } = this.props;

    if (Object.getOwnPropertyNames(editProfile).length !== 0) {
      this.setState(prevState => {
        let formFields = { ...prevState.formFields };
        formFields.firstName = editProfile.firstName;
        formFields.mi = editProfile.mi;
        formFields.lastName = editProfile.lastName;
        formFields.avatarUrl = editProfile.avatarUrl;
        let isEdit = true;
        return { formFields, isEdit };
      });
    } else {
      this.setState(() => {
        let isEdit = false;
        return { isEdit };
      });
    }
  };

  handleSubmit = values => {
    _logger(values);
    this.props.submit(values);
  };

  afterFileUpload = response => {
    if (response[0].length !== 0) {
      let uploadedPicture = response[0][0];

      if (!this.state.isChecked) {
        this.setState(prevState => {
          let formFields = { ...prevState.formFields };
          formFields.avatarUrl = uploadedPicture;
          let activeKey = "2";
          let isFileSubmitted = true;

          return { formFields, activeKey, isFileSubmitted };
        });
      } else {
        _logger("afterFileUpload firing");
        this.setState(
          prevState => {
            let formFields = { ...prevState.formFields };
            formFields.avatarUrl = uploadedPicture;
            return { formFields };
          },
          () => {
            this.props.submit(this.state.formFields);
          }
        );
      }
    } else {
      toast("File NOT uploaded. Please try again.");
    }
  };

  onTabChange = tabKey => {
    if (!this.state.isFileSubmitted) {
      this.setState(() => {
        let activeKey = tabKey;
        return { activeKey };
      });
    }
  };

  onNextClick = e => {
    e.preventDefault();
    this.setState(() => {
      let activeKey = "2";
      return { activeKey };
    });
  };

  onBackClick = e => {
    e.preventDefault();
    this.setState(() => {
      let activeKey = "1";
      return { activeKey };
    });
  };

  onCheckboxClick = () => {
    let toggle = !this.state.isChecked;
    this.setState(() => {
      let isChecked = toggle;
      return { isChecked };
    });
  };

  onRemovePicClick = e => {
    e.preventDefault();
    let userProfileObj = { ...this.state.formFields };
    this.props.removeAvatar(userProfileObj);
  };

  changeTab = e => {
    const id = e.target.id;
    if (this.state.activeKey !== id) {
      this.setState(() => {
        return { activeKey: id };
      });
    }
  };

  componentDidMount() {
    this.checkIfEdit();
  }

  render() {
    _logger("form rendering");
    let { formFields } = this.state;

    return (
      <Card className="card-border shadow">
        <CardBody>
          <Container>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={this.state.activeKey === "1" ? "active" : ""}
                  onClick={this.changeTab}
                  id="1"
                >
                  Profile Pic
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeKey === "2" ? "active" : ""}
                  onClick={this.changeTab}
                  id="2"
                >
                  Name
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeKey}>
              <TabPane tabId="1">
                <div className={this.state.isEdit ? "d-none" : ""}>
                  <p>Please select a file for your Profile Picture.</p>
                  <p>
                    If you would rather select a Profile Picture later, click
                    Next.
                  </p>
                </div>
                <div className={this.state.isEdit ? "" : "d-none"}>
                  <p className="mb-n1">
                    Please select a file to update your Profile Picture.
                  </p>
                  <p className="mb-n1">
                    If you do not wish to update your picture, click Next.
                  </p>
                  <p>
                    If you wish to just update your picture, click the checkbox
                    below before clicking Submit
                  </p>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <div>
                      <input type="checkbox" onClick={this.onCheckboxClick} />
                      <label className="ml-1">
                        Only update Profile Picture
                      </label>
                    </div>
                    <div>
                      <p>
                        <a href="#" onClick={this.onRemovePicClick}>
                          Click here
                        </a>{" "}
                        to just remove your profile picture.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <FileUpload
                    AfterUpload={this.afterFileUpload}
                    isMultiple={false}
                  />
                </div>
                <div className="d-block text-right card-footer d-flex justify-content-between">
                  <Button
                    className="btn btn-danger"
                    onClick={this.onCancelClick}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.onNextClick}
                    className="btn-wide btn-shadow"
                    color="primary"
                  >
                    Next
                  </Button>
                </div>
              </TabPane>
              <TabPane tabId="2">
                <Formik
                  enableReinitialize={true}
                  initialValues={formFields}
                  onSubmit={this.handleSubmit}
                  validationSchema={userProfileFormSchema}
                >
                  {props => {
                    const {
                      values,
                      touched,
                      errors,
                      handleSubmit,
                      isValid,
                      isSubmitting
                    } = props;
                    return (
                      <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                          <Label sm={3}>First Name</Label>
                          <Col sm={8}>
                            <Field
                              name="firstName"
                              type="text"
                              values={values.firstName}
                              placeholder="First Name"
                              autoComplete="off"
                              className={
                                errors.firstName && touched.firstName
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.firstName && touched.firstName && (
                              <span className="input-feedback">
                                {errors.firstName}
                              </span>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>Middle Initial</Label>
                          <Col sm={8}>
                            <Field
                              name="mi"
                              type="text"
                              value={values.mi}
                              placeholder="Middle Initial"
                              autoComplete="off"
                              className={
                                errors.mi && touched.mi
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.mi && touched.mi && (
                              <span className="input-feedback">
                                {errors.mi}
                              </span>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>Last Name</Label>
                          <Col sm={8}>
                            <Field
                              name="lastName"
                              type="text"
                              value={values.lastName}
                              placeholder="Last Name"
                              autoComplete="off"
                              className={
                                errors.lastName && touched.lastName
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.lastName && touched.lastName && (
                              <span className="input-feedback">
                                {errors.lastName}
                              </span>
                            )}
                          </Col>
                        </FormGroup>
                        <div className="d-block text-right card-footer d-flex justify-content-between">
                          {this.state.isFileSubmitted ? null : (
                            <Button color="primary" onClick={this.onBackClick}>
                              Back
                            </Button>
                          )}
                          <Button
                            className={"btn btn-danger"}
                            onClick={this.onCancelClick}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                          >
                            Submit
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </TabPane>
            </TabContent>
          </Container>
        </CardBody>
      </Card>
    );
  }
}

UserProfileForm.propTypes = {
  cancel: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  removeAvatar: PropTypes.func.isRequired,
  editProfile: PropTypes.shape({
    veteranStatus: PropTypes.string,
    userStatus: PropTypes.string,
    id: PropTypes.number,
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    mi: PropTypes.string,
    avatarUrl: PropTypes.string,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string
  })
};

export default UserProfileForm;

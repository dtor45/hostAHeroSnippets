import React from "react";
import { Row, Col, Card, FormGroup, Label, Button } from "reactstrap";
import { Formik, Field, Form } from "formik";
import uprFormValidationSchema from "./uprFormValidationSchema";
import { IoIosStar } from "react-icons/io";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("UserProfileReviewForm");

class UserProfileReviewForm extends React.Component {
  state = {
    formFields: {
      description: "",
      rating: 5
    }
  };

  handleSubmit = values => {
    _logger(values);
  };

  onCancelClick = e => {
    e.preventDefault();
    _logger("Cancel Button Clicked!");
    this.props.history.push("/");
  };

  render() {
    return (
      <Row className="d-flex justify-content-center">
        <Col sm="12" md="8">
          <Card body className="card-border shadow">
            <Formik
              enableReinitialize={true}
              initialValues={this.state.formFields}
              onSubmit={this.handleSubmit}
              validationSchema={uprFormValidationSchema}
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
                      <Label sm={2}>Rating</Label>
                      <Col sm={8}>
                        <Field
                          name="rating"
                          type="range"
                          min="1"
                          max="5"
                          step=".5"
                          values={values.rating}
                          autoComplete="off"
                          className={
                            errors.rating && touched.rating
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                      </Col>
                      <Col className="mt-1 pr-0 text-right">
                        <IoIosStar size={20} color="orange" />
                      </Col>
                      <Col className="mt-1 pl-1">
                        <h6 className="mt-1">{values.rating}</h6>
                      </Col>
                      {errors.rating && touched.rating && (
                        <span className="input-feedback">{errors.rating}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label></Label>
                      <Field
                        name="description"
                        component="textarea"
                        rows={4}
                        value={values.description}
                        placeholder="Write your review here"
                        autoComplete="off"
                        className={
                          errors.description && touched.description
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.description && touched.description && (
                        <span className="input-feedback text-danger">
                          {errors.description}
                        </span>
                      )}
                    </FormGroup>
                    <div className="d-block text-right card-footer d-flex justify-content-between">
                      <Button
                        className="btn-danger"
                        onClick={this.onCancelClick}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!isValid || isSubmitting}>
                        Submit
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Card>
        </Col>
      </Row>
    );
  }
}

UserProfileReviewForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default UserProfileReviewForm;

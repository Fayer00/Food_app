class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  skip_before_action :verify_authenticity_token, if: :json_request?

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: {code: 200, message: 'Signed up successfully.'},
        data: {
          id: resource.id,
          email: resource.email,
          created_at: resource.created_at
        }
      }
    else
      render json: {
        status: {
          code: 422,
          message: "User couldn't be created successfully.",
          errors: resource.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  def json_request?
    request.format.json? || request.content_type =~ /json/
  end
end
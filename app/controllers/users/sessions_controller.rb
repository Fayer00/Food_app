class Users::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_authenticity_token, if: :json_request?

  def create
    super do |user|
      if request.format.json?
        token = request.env['warden-jwt_auth.token']
        response.headers['Authorization'] = "Bearer #{token}"
        response.headers['Access-Control-Expose-Headers'] = 'Authorization'
        return render json: {
          status: { code: 200, message: 'Logged in successfully.' },
          data: user
        }
      end
    end
  end

  # Override the destroy method to handle JSON requests
  def destroy
    if json_request?
      # For JSON requests, just return success without trying to use rememberable
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      render json: {
        status: 200,
        message: "Logged out successfully."
      }, status: :ok
    else
      # For non-JSON requests, use the default behavior
      super
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: "Logged out successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end

  def json_request?
    request.format.json? || request.content_type =~ /json/
  end
end
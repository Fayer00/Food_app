module Api
  module V1
    class ApiController < ActionController::API
      before_action :allow_test_host_in_development

      private

      def allow_test_host_in_development
        if Rails.env.test?
          Rails.application.config.hosts << 'www.example.com' unless Rails.application.config.hosts.include?('www.example.com')
        end
      end
    end
  end
end
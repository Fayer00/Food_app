class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { head :ok }
      format.any { head :not_acceptable }
    end
  end
end

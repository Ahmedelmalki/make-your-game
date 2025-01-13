m ?= "Update"

config:
	git config --global credential.helper store
	git config --global user.email "elmalkiahmed02@gmail.coml"
	git config --global user.name "Ahmedelmalki"

push:
	git add .
	git commit -m "$(m)"
	git push 

help:
	@echo "Usage:"
	@echo "  make push m=\"your commit message\""
clean:
	@echo cleaning...
	git checkout .
	clear

m ?= "Update"
e ?= ""
u ?= ""

config:
	git config --global credential.helper store
	git config --global user.email "$(e)"
	git config --global user.name "$(u)"

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

m ?= "Update"

push:
	git add .
	git commit -m "$(m)"
	git push 

help:
	@echo "Usage:"
	@echo "  make push m=\"your commit message\""

M ?= "Update"

push:
	git add .
	git commit -m "$(M)"
	git push -f

help:
	@echo "Usage:"
	@echo "  make push M=\"your commit message\""
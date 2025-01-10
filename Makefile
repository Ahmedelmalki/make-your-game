COMMIT_MSG ?= "Update"

push:
	git add .
	git commit -m "$(COMMIT_MSG)"
	git push

help:
	@echo "Usage:"
	@echo "  make push COMMIT_MSG=\"your commit message\""
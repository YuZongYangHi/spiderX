package main

import (
	"github.com/YuZongYangHi/spiderX/spider-api/cmd/apiserver/app"
	"k8s.io/component-base/cli"
	"os"
)

func main() {
	command := app.NewAPIServerCommand()
	code := cli.Run(command)
	os.Exit(code)
}

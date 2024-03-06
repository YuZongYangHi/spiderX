package app

import (
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/cmd/apiserver/app/options"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/cache"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	cliflag "k8s.io/component-base/cli/flag"
)

const (
	componentName = "spider-apiServer"
)

func NewAPIServerCommand() *cobra.Command {
	cleanFlagSet := pflag.NewFlagSet(componentName, pflag.ContinueOnError)
	serverOption := options.NewServerRunOption()
	cmd := &cobra.Command{
		Use:                componentName,
		Long:               `spider-apiServer`,
		DisableFlagParsing: true,
		SilenceUsage:       true,
		RunE: func(cmd *cobra.Command, args []string) error {
			// initial flag parse, since we disable cobra's flag parsing
			if err := cleanFlagSet.Parse(args); err != nil {
				return fmt.Errorf("failed to parse %s flag: %w", componentName, err)
			}

			// check if there are non-flag arguments in the command line
			cmds := cleanFlagSet.Args()
			if len(cmds) > 0 {
				return fmt.Errorf("unknown command %+s", cmds[0])
			}

			// short-circuit on help
			help, err := cleanFlagSet.GetBool("help")
			if err != nil {
				return errors.New(`"help" flag is non-bool, programmer error, please correct`)
			}
			if help {
				return cmd.Help()
			}
			cliflag.PrintFlags(cleanFlagSet)
			return run(serverOption)
		},
	}
	serverOption.AddFlags(cleanFlagSet)
	cleanFlagSet.BoolP("help", "h", false, fmt.Sprintf("help for %s", cmd.Name()))

	// ugly, but necessary, because Cobra's default UsageFunc and HelpFunc pollute the flagset with global flags
	const usageFmt = "Usage:\n  %s\n\nFlags:\n%s"
	cmd.SetUsageFunc(func(cmd *cobra.Command) error {
		fmt.Fprintf(cmd.OutOrStderr(), usageFmt, cmd.UseLine(), cleanFlagSet.FlagUsagesWrapped(2))
		return nil
	})
	cmd.SetHelpFunc(func(cmd *cobra.Command, args []string) {
		fmt.Fprintf(cmd.OutOrStdout(), "%s\n\n"+usageFmt, cmd.Long, cmd.UseLine(), cleanFlagSet.FlagUsagesWrapped(2))
	})
	return cmd

}

func run(server *options.ServerRunOption) error {

	conf, err := config.NewAPIServerConfig(server.Config)
	if err != nil {
		return err
	}

	if err = models.InitialDB(&conf.DB); err != nil {
		return err
	}

	if err = cache.NewCacheClient(&conf.Cache); err != nil {
		return err
	}

	apiServer, err := apiserver.NewAPIServer(conf)
	if err != nil {
		return err
	}

	apiServer.Start()
	return nil
}

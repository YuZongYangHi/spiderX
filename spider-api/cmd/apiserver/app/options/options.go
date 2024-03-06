package options

import "github.com/spf13/pflag"

type ServerRunOption struct {
	Config string
}

func (v *ServerRunOption) AddFlags(mainfs *pflag.FlagSet) {
	fs := pflag.NewFlagSet("", pflag.ExitOnError)
	defer func() {
		fs.VisitAll(func(f *pflag.Flag) {
			if len(f.Deprecated) > 0 {
				f.Hidden = false
			}
		})
		mainfs.AddFlagSet(fs)
	}()

	fs.StringVar(&v.Config, "config", "apiserver.yaml", "service config file")
}

func NewServerRunOption() *ServerRunOption {
	return &ServerRunOption{}
}

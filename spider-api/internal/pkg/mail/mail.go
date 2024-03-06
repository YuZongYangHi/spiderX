package mail

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"gopkg.in/gomail.v2"
	"strconv"
)

func Send(mailTo []string, subject string, body string) error {

	mailConn := map[string]string{
		"user": config.ApiServerConfig().Mail.User,
		"pass": config.ApiServerConfig().Mail.Password,
		"host": config.ApiServerConfig().Mail.Host,
		"port": config.ApiServerConfig().Mail.Port,
	}

	port, _ := strconv.Atoi(mailConn["port"])

	m := gomail.NewMessage()

	// send
	m.SetHeader("From", m.FormatAddress(mailConn["user"], config.ApiServerConfig().Mail.StationName))

	m.SetHeader("To", mailTo...)

	// title
	m.SetHeader("Subject", fmt.Sprintf("[%s] %s", config.ApiServerConfig().Mail.StationName, subject))

	// make a copy for
	m.SetHeader("cc", config.ApiServerConfig().Mail.User)

	// send body type
	m.SetBody("text/html", body)

	d := gomail.NewDialer(
		mailConn["host"],
		port,
		mailConn["user"],
		mailConn["pass"])

	err := d.DialAndSend(m)
	return err
}

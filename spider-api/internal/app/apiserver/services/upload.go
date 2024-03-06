package services

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/labstack/echo/v4"
	"github.com/xuri/excelize/v2"
	"io"
	"os"
	"path"
)

type Upload struct {
	dir   string
	Excel *excelize.File
	ctx   echo.Context
}

func (c *Upload) Parser() ([][]string, error) {
	file, err := c.ctx.FormFile("file")
	if err != nil {
		return nil, err
	}

	uploadedFileName := file.Filename
	uploadedFilePath := path.Join(fmt.Sprintf("%s/%s", config.ApiServerConfig().Common.UploadPath, c.dir), uploadedFileName)

	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	dst, err := os.Create(uploadedFilePath)
	if err != nil {
		return nil, err
	}

	if _, err = io.Copy(dst, src); err != nil {
		return nil, err
	}

	c.Excel, err = parsers.NewExcel(uploadedFilePath)
	if err != nil {
		return nil, err
	}

	rows, err := c.Excel.GetRows(c.Excel.GetSheetName(0))
	if err != nil {
		return nil, err
	}

	return rows, nil
}

func NewUpload(dir string, ctx echo.Context) *Upload {
	return &Upload{
		dir: dir,
		ctx: ctx,
	}
}

package jwt

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"strings"
)

type CustomClaims struct {
	Audience  string `json:"aud,omitempty"`
	ExpiresAt int64  `json:"exp,omitempty"`
	IssuedAt  int64  `json:"iat,omitempty"`
	Issuer    string `json:"iss,omitempty"`
	Salt      string
}

type Claims struct {
	jwt.StandardClaims
}

func GenerateToken(c *CustomClaims) (string, error) {
	claims := Claims{
		StandardClaims: jwt.StandardClaims{
			Audience:  c.Audience,
			ExpiresAt: c.ExpiresAt,
			IssuedAt:  c.IssuedAt,
			Issuer:    c.Issuer,
		},
	}
	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString([]byte(c.Salt))
	return token, err
}

func ParseToken(token string, salt string) (*Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(salt), nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}
	return nil, err
}

func Authentication(token string, salt string) (*Claims, error) {

	if !VerifyTokenIsValid(token) {
		return nil, errors.New("invalid certificate")
	}

	_, token = SplitJwtToken(token)
	claims, err := ParseToken(token, salt)

	if err != nil {
		return nil, errors.New(err.Error())
	}

	return claims, nil
}

func SplitJwtToken(jwtToken string) (string, string) {
	sp := strings.Split(jwtToken, " ")
	if len(sp) != 2 {
		return "", ""
	}
	bearer, token := sp[0], sp[1]
	return bearer, token
}

func VerifyTokenIsValid(jwtToken string) bool {
	bearer, token := SplitJwtToken(jwtToken)

	if bearer == "" || token == "" {
		return false
	}

	if VerifyTokenType(jwtToken) {
		return true
	}

	return false
}

func VerifyTokenType(jwtToken string) bool {
	bearer, _ := SplitJwtToken(jwtToken)

	if bearer == "Bearer" {
		return true
	}
	return false
}

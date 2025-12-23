package logger

import (
	"os"
	"path/filepath"
	"runtime"
)

type Logger struct {
	LoggerFilePath string
}

func NewLogger(path string) *Logger {
	loggerfile := filepath.Join(path, "logs.txt")
	if _, err := os.Stat(loggerfile); err == nil {
		if err := os.Remove(loggerfile); err != nil {
			panic(err)
		}
	}
	return &Logger{LoggerFilePath: loggerfile}
}

func (l *Logger) Error(err error) {
	l.log("[ERROR]", err.Error())
}

func (l *Logger) Info(msg string) {
	l.log("[INFO]", msg)
}

func (l *Logger) log(level, message string) {
	file, err := os.OpenFile(l.LoggerFilePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Получаем место вызова (2 - пропускаем эту функцию и Error/Info метод)
	_, filename, line, _ := runtime.Caller(2)

	// Пишем в лог: [УРОВЕНЬ] файл:строка - сообщение
	logEntry := level + " " + filepath.Base(filename) + ":" + string(rune('0'+line)) + " - " + message + "\n"

	_, err = file.WriteString(logEntry)
	if err != nil {
		panic(err)
	}
}

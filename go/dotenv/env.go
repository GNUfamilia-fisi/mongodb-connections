package dotenv

import (
	"encoding/json"
	"os"
)

func GetFromEnv(filepath string) (map[string]string, error) {
    var data map[string]string;
    envsByte, readErr := os.ReadFile(filepath);
    if readErr != nil {
        return nil, readErr;
    }
    marshalErr := json.Unmarshal(envsByte, &data);
    if marshalErr != nil {
        return nil, marshalErr;
    }
    return data, nil;
}

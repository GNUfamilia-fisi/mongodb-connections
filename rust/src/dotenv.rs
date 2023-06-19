use std::io::{self, prelude::*, BufReader};
use std::fs;
use std::path::Path;
use std::io::Lines;
use std::{env};

type BufReaderLines<T> = Lines<io::BufReader<T>>;

struct EmptyReader;

impl Read for EmptyReader {
    fn read(&mut self, _: &mut [u8]) -> io::Result<usize> {
        Ok(0)
    }
}

#[derive(Debug)]
pub enum DotEnvError {
    Io(io::Error),
}

impl std::error::Error for DotEnvError {}

impl std::fmt::Display for DotEnvError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DotEnvError::Io(err) => write!(f, "I/O error: {}", err),
        }
    }
}

impl From<io::Error> for DotEnvError {
    fn from(err: io::Error) -> Self {
        DotEnvError::Io(err)
    }
}

impl From<DotEnvError> for io::Error {
    fn from(err: DotEnvError) -> Self {
        match err {
            DotEnvError::Io(err) => err,
        }
    }
}

struct DotEnv;

impl DotEnv {
    fn new() -> Self {
        DotEnv
    }

    // This read_lines implementation is overcomplicated for learning purposes
    fn read_lines<P>(path: P) -> Result<BufReaderLines<Box<dyn Read>>, io::Error>
    where P: AsRef<Path> {
        match fs::File::open(path) {
            Err(err) => {
                // When .env was not found, read from empty buffer
                if err.kind() == io::ErrorKind::NotFound {
                    let empty_reader: Box<dyn Read> = Box::new(EmptyReader);
                    let empty_buf_reader = BufReader::new(empty_reader);
                    return Ok(empty_buf_reader.lines());
                }
                return Err(err);
            },
            Ok(file) => {
                Ok(io::BufReader::new(Box::new(file) as Box<dyn Read>).lines())
            }
        }
    }

    pub fn parse<P>(self, path: P) -> Result<(), io::Error>
    where P: AsRef<Path> {
        for line in DotEnv::read_lines(path)? {
            let line = line.unwrap();
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with("#") {
                continue;
            }
            let mut tokens = trimmed.split("=");
            // do secure indexing to find the key and value
            let key = tokens.next().unwrap_or("");
            let value = tokens.next().unwrap_or("");
            if key.is_empty() || value.is_empty() {
                continue;
            }
            env::set_var(key, value);
        }
        Ok(())
    }
}

pub fn parse() -> Result<(), DotEnvError> {
    let parser = DotEnv::new();

    let path = env::current_dir()?.join(".env");
    parser.parse(path)?;

    Ok(())
}

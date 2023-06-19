use std::io::{self, prelude::*};
use std::path::Path;
use std::io::Lines;
use std::{env, fs::{self, File}};

type BufReaderLines = Lines<io::BufReader<File>>;

pub enum DotEnvError {
    Io(io::Error),
    Parse,
}

impl From<io::Error> for DotEnvError {
    fn from(err: io::Error) -> Self {
        DotEnvError::Io(err)
    }
}

struct DotEnv;

impl DotEnv {
    fn new() -> Self {
        DotEnv
    }

    fn read_lines<P>(path: P) -> Result<BufReaderLines, io::Error>
    where P: AsRef<Path> {
        let file = fs::File::open(path)?;
        Ok(io::BufReader::new(file).lines())
    }

    pub fn parse<P>(self, path: P) -> Result<(), io::Error>
    where P: AsRef<Path> {
        for line in DotEnv::read_lines(path)? {
            if let Ok(ip) = line {
                println!("{}", ip);
            }
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

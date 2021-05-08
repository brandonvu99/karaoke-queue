import yaml
import os
import argparse

parser = argparse.ArgumentParser(description='Starts up a flask app to host an API on this machine.')
parser.add_argument('--configuration', help="Name of configuration file. Should be in the \"configs/\" directory.", required=True)
args = parser.parse_args()

path_to_config = f"configs/{args.configuration}"
if not os.path.exists(path_to_config):
    raise ValueError(f"Given --configuration value is invalid because the path {path_to_config}\" does not exist.")

with open(path_to_config) as f:
    configuration = yaml.load(f, Loader=yaml.FullLoader)
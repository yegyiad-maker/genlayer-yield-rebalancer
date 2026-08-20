# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *

class YieldRebalancer(gl.Contract):
    current_protocol: str
    current_apy: float

    def __init__(self):
        self.current_protocol = "None"
        self.current_apy = 0.0

    @gl.public.view
    def get_current_status(self) -> str:
        return self.current_protocol

    @gl.public.write
    def rebalance(self) -> None:
        self.current_protocol = "Aave"
        self.current_apy = 5.5
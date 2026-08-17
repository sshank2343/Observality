import logging

logger = logging.getLogger("observability_sdk")
logger.setLevel(logging.WARNING)

_handler = logging.StreamHandler()
_handler.setFormatter(logging.Formatter("[observability_sdk] %(levelname)s: %(message)s"))
logger.addHandler(_handler)
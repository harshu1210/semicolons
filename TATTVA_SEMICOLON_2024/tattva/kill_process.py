import subprocess
p = subprocess.Popen(["netstat", "-a", "-o", "-n", "|", "findstr", ":5000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
out, err = p.communicate()
pid = out.decode("utf-8").strip().split()[-1]


p = subprocess.Popen(["taskkill", "/PID", pid, "/F"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
out, err = p.communicate()
# Print the output
print(out, err, "\n", pid)

import subprocess

def main():
	old_file = "Cisco-IOS-XR-telemetry-model-driven-oper"
	new_file = old_file
	old_vers = "633"
	new_vers = "652"
	diff_type = "normal"
	header = "false"
	create_temp_directory()
	create_output_directory()
	copy_and_modify_files(old_file, old_vers)
	if (check_for_valid_files(old_file + "-" + old_vers, "temp_files") and check_for_valid_files(new_file, new_vers + "-yang")):
		subpr = subprocess.run([
			"yangdiff-pro",
			"--old=temp_files/" + old_file + "-" + old_vers + ".yang",
			"--new=" + new_vers + "-yang/" + new_file + ".yang",
			"--modpath=" + "temp_files:" + new_vers + "-yang",
			"--difftype=" + diff_type,
			"--header=" + header], capture_output=True, text=True)
		output = subpr.stdout.strip('\n')
		if output.startswith("Error"):
			print("Error(s) occurred - Comparison unsuccessful")
			error = output[7:output.find("yangdiff")]
			error = error[:1].upper() + error[1:]
			error = error.strip('\n')
			print(error)
		else:
			file = open("diff_output/diff.txt", "w+")
			file.write(output)
			file.close()
			print(output)

def create_temp_directory():
	subpr = subprocess.run([
		"mkdir",
		"temp_files"])

def create_output_directory():
	subpr = subprocess.run([
		"mkdir",
		"diff_output"])

def check_for_valid_files(file, dir_name):
	subpr = subprocess.run([
		"pyang", 
		"-f", 
		"tree", 
		dir_name + "/" + file + ".yang",  
		"-p",
		dir_name], capture_output=True, text=True)
	if subpr.stderr != "":
		print("Error(s) occurred - File set invalid")
		index = subpr.stderr.find("]")
		if index != -1:
			print((subpr.stderr[index + 2:]).strip('\n'))
			return False
		errors = subpr.stderr.splitlines()
		for line in errors:
			line = line[line.find("error: ") + 7:]
			line = line[:1].upper() + line[1:]
			if not line.startswith("Module"):
				print("    ", line)
			else:
				print(line)
		return False
	output = subpr.stdout.strip('\n')
	if output == "":
		print("Please select a primary module to compare. You have selected a submodule or types file." +
			"\nA node tree cannot be constructed from this file.")
		return False
	return True

def copy_and_modify_files(file, vers):
	file_list = [file]
	completed = set()
	while file_list:
		file = file_list.pop()
		if file in completed:
			continue
		copy = open("temp_files/" + file + "-" + vers + ".yang", "w+")
		with open(vers + "-yang/" + file + ".yang", 'r') as orig:
			copy.write(modify_line(orig.readline(), vers)[0])
			header_parsed = False
			for line in orig:
				if header_parsed:
					copy.write(line)
					continue
				if line.find("/***") != -1:
					copy.write(line)
					continue
				if line.find("import") != -1 or line.find("include") != -1 or line.find("belongs-to") != -1:
					tab = len(line) - len(line.lstrip())
					result = modify_line(line[tab:], vers)
					file_list.append(result[1])
					copy.write(line[:tab] + result[0])
					continue
				if line.find("organization") >= 0:
					header_parsed = True
				copy.write(line)
		copy.close()
		completed.add(file)

def modify_line(line, vers):
	words = line.split()
	file_name = words[1]
	words[1] = words[1] + "-" + vers
	words.append('\n')
	return [' '.join(words), file_name]


if __name__ == "__main__":
	main()
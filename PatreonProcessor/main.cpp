#include <iostream>
#include <fstream>
#include <string>
#include <vector>

inline std::string File_ReadAllText(const std::string& _Filename)
{
	std::ifstream file;
	file.open(_Filename.c_str(), std::ios::binary);

	if (file.good() == false || file.is_open() == false)
	{
		return "";
	}
	std::string content;
	file.seekg(0, std::ios::end);
	content.reserve(std::size_t(file.tellg()));
	file.seekg(0, std::ios::beg);
	content.assign((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());

	return content;
}

struct Patron{
    std::string ForName;
    std::string SurName;
    std::string Mail;
    int Level = 0;    
    double Pleged = 0.00;
    unsigned int TS = 0;
};

int main(int argc, char ** argv){
    std::cout << argv[1] << std::endl;
    auto textData = File_ReadAllText(argv[1]);

    if (textData.empty())
    {
        std::cout << "Report is empty!" << std::endl;
        return 1;
    }

    const int NumColumns = std::stoi(argv[3]);
    std::string::const_iterator Token = textData.begin();
    std::string::const_iterator TokenEnd = textData.end();

    std::vector<Patron> patrons;

    int iterated = 0;
    int level = 0;
    while(Token != TokenEnd) // Rows
    {
        Patron pat;
        bool skip = false;
        for (int i=0; i<NumColumns; ++i) // Columns
        {
            std::string column = "";
            bool openQuote = false;
            while(Token != TokenEnd)
            {
                if (*Token == '"')
                    openQuote = !openQuote;

                if (*Token == '\n' && !openQuote)
                    break;

                if (*Token == ',' && !openQuote)
                    break;

                column += *Token;
                
                ++Token;
            }
            
            if (iterated == 0) skip = true;

            if (i==0 && column == "6 + Reward")
            {
                level = 3;
                skip = true;
            }
            else if (i==0 && column == "3 + Reward")
            {
                level = 2;
                skip = true;
            }
            else if (i==0 && column == "1 + Reward")
            {
                level = 1;
                skip = true;
            }

            if (Token != TokenEnd)
                ++Token;

            if (skip) continue;

            if (i == 0)
                pat.ForName = column;
            else if (i==1)
                pat.SurName = column;
            else if (i==2)
                pat.Mail = column;
            else if (i==3)
                pat.Pleged = std::stof(column);
            else
                pat.Level = level;
            
            pat.Level = 4;
        }

        if (pat.Mail.find("@") != std::string::npos)
            patrons.push_back(std::move(pat));
        ++iterated;
    }

    for(auto& pat : patrons)
        std::cout << pat.ForName << " " << pat.SurName << ": " << pat.Mail << " => " << pat.Level << " / " << pat.Pleged << std::endl;

    // Creating SQL file
    int ts = std::stoi(argv[2]);
    std::ofstream out("PatreonReport_Processed_"+std::to_string(ts)+".sql");

    for(auto& pat : patrons)
        out << "UPDATE `gn_user` SET `level` = " << pat.Level << " WHERE `mail` = \"" << pat.Mail << "\";" << std::endl;

    out << std::endl;

    bool next = false;
    out << "INSERT INTO `gn_supporters` (`name`, `date`, `amount`, `type`) VALUES " << std::endl;
    for(auto& pat : patrons)
    {
        if (next) out << "," << std::endl;
        out << "(" << "IFNULL((SELECT `name` FROM `gn_user` WHERE `mail` = \"" << pat.Mail << "\"), \"" << (pat.ForName + (!pat.SurName.empty() ? " " + std::string(1, pat.SurName[0]) + "." : ""))  << "\"), " << ts << ", " << static_cast<int>((pat.Pleged * 100)) << ", " << "1)";
        next = true;
    }
    out << ";" << std::endl << std::endl << std::endl;
    return 0;
}